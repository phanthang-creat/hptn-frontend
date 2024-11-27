interface ChessKnowledgeSectionType {
  id: string
  title: string
  subTitle: string
  image: string
  order: number
  enabled: boolean
  postCategorySlug: string
}

interface ChessKnowledgePageConfigDataType {
  chessKnowledge?: Array<ChessKnowledgeSectionType>
  educationKnowledge: {
    postCategorySlug: string
  }
}

export type { ChessKnowledgePageConfigDataType, ChessKnowledgeSectionType }
