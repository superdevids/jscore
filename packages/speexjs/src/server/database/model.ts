import { QueryBuilder } from './query.js'
import type { QueryRunner } from './types.js'

export class Model {
  id?: number | string
  static table: string = ''
  static connection: QueryRunner | null = null
  protected static queryRunner: QueryRunner | null = null

  static setConnection(conn: QueryRunner): void {
    this.connection = conn
    this.queryRunner = conn
  }

  static query<T extends typeof Model>(this: T): QueryBuilder {
    if (!this.queryRunner) {
      throw new Error('Database connection not set. Call Model.setConnection() first.')
    }
    return new QueryBuilder(this.queryRunner, this.table)
  }

  static async all<T extends typeof Model>(this: T): Promise<InstanceType<T>[]> {
    const rows = await this.query().get()
    return rows.map((row: Record<string, any>) => this.hydrate(row)) as any
  }

  static async find<T extends typeof Model>(this: T, id: number | string): Promise<InstanceType<T> | null> {
    const row = await this.query().find(id)
    if (!row) return null
    return this.hydrate(row) as any
  }

  static async where<T extends typeof Model>(this: T, column: string, value: any): Promise<QueryBuilder> {
    return this.query().where(column, value)
  }

  static async create<T extends typeof Model>(this: T, data: Record<string, any>): Promise<InstanceType<T>> {
    const id = await this.query().insert(data)
    return this.find(id) as any
  }

  static async updateOrCreate<T extends typeof Model>(
    this: T,
    attributes: Record<string, any>,
    values?: Record<string, any>,
  ): Promise<InstanceType<T>> {
    const qb = this.query()
    for (const [key, value] of Object.entries(attributes)) {
      qb.where(key, value)
    }
    const existing = await qb.first()
    if (existing) {
      const mergeValues = values ?? attributes
      const id = (existing as any).id
      const updateQb = new QueryBuilder(this.queryRunner!, this.table)
      for (const [key, value] of Object.entries(attributes)) {
        updateQb.where(key, value)
      }
      await updateQb.update(mergeValues)
      return this.find(id) as any
    }
    return this.create({ ...attributes, ...values }) as any
  }

  async save(): Promise<void> {
    const ModelClass = this.constructor as typeof Model
    const id = this.id
    if (id !== undefined && id !== null) {
      await ModelClass.query().where('id', id).update(this.getData())
    } else {
      const newId = await ModelClass.query().insert(this.getData())
      this.id = newId
    }
  }

  async delete(): Promise<void> {
    const ModelClass = this.constructor as typeof Model
    const id = this.id
    if (id !== undefined && id !== null) {
      await ModelClass.query().where('id', id).delete()
    }
  }

  static belongsTo<T extends typeof Model>(
    this: T,
    relatedModel: typeof Model,
    foreignKey?: string,
    ownerKey?: string,
  ): any {
    const related = relatedModel.table
    const fk = foreignKey ?? `${related}_id`
    const ok = ownerKey ?? 'id'
    return this.query().where(fk, ok)
  }

  static hasMany<T extends typeof Model>(
    this: T,
    relatedModel: typeof Model,
    foreignKey?: string,
    localKey?: string,
  ): any {
    const related = relatedModel.table
    const fk = foreignKey ?? `${this.table}_id`
    const lk = localKey ?? 'id'
    return this.query().join(related, fk, '=', lk)
  }

  private static hydrate<T extends typeof Model>(this: T, data: Record<string, any>): InstanceType<T> {
    const instance = new this() as InstanceType<T>
    for (const [key, value] of Object.entries(data)) {
      ;(instance as any)[key] = value
    }
    return instance
  }

  private getData(): Record<string, any> {
    const data: Record<string, any> = {}
    const instance = this as Record<string, any>
    const prototype = Object.getPrototypeOf(this)
    const ownKeys = [
      ...Object.getOwnPropertyNames(instance),
      ...Object.keys(instance),
    ]
    const classKeys = new Set([
      ...Object.getOwnPropertyNames(prototype),
      'save', 'delete', 'getData',
    ])
    for (const key of ownKeys) {
      if (typeof key === 'string' && !classKeys.has(key) && key !== 'constructor') {
        data[key] = instance[key]
      }
    }
    return data
  }
}
