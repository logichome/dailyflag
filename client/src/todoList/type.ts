export interface ITodoContent {
  readonly id: string,
  title: string,
  content?: string,
  expectDate: string,
  isFinished: boolean,
  isDeleted: boolean,
  createdAt: number,
  updateAt: number
}

export enum FilterTag {all, finished, unfinished, rubbish}

export enum MissionType {important, normal, alternative}