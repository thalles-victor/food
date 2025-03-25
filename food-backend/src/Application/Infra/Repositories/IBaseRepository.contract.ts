export interface IBaseRepositoryContract<
  Entity,
  UpdateEntity,
  UniqueEntityRefs,
> {
  create(entity: Entity): Promise<Entity>;
  getBy(unqRef: UniqueEntityRefs): Promise<Entity | null>;
  update(unqRef: UniqueEntityRefs, updateEntity: UpdateEntity): Promise<Entity>;
  delete(unqRef: UniqueEntityRefs): Promise<void>;
  softDelete(unqRef: UniqueEntityRefs): Promise<Entity>;
  getAll(): Promise<Entity[]>;
}
