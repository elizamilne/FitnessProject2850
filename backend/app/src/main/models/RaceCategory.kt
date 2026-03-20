package org.example.models
import org.jetbrains.exposed.sql.Table
object RaceCategories : Table("race_categories") {
    val raceId = reference("race_id", Race.id)
    val categoryId = reference("category_id", Categories.id)

    override val primaryKey = PrimaryKey(raceId, categoryId)
}