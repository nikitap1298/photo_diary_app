export interface Serializable<T> {
  deserialize(input: unknown): T
}
