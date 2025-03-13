export interface RuleCollectionsRepository {
  assignRuleToCollection(ruleId: string, collectionId: string): Promise<boolean>;
}
