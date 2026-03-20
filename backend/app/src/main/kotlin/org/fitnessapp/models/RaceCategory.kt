package org.fitnessapp.models

import org.jetbrains.exposed.sql.*

object RaceCategory : Table("race_category") {
    val raceId = reference("race_id", Race.id)
    val categoryId = reference("category_id", Category.id)

    override val primaryKey = PrimaryKey(raceId, categoryId)
}