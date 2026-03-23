package org.fitnessapp.services

import org.jetbrains.exposed.sql.ResultRow
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.sql.SqlExpressionBuilder.eq

import org.fitnessapp.models.MuscleGroup
import org.fitnessapp.models.MuscleGroupDTO

fun ResultRow.toMuscleGroupDTO() = MuscleGroupDTO(
    id = this[MuscleGroup.id],
    name = this[MuscleGroup.name]
)

object MuscleGroupService {
    fun findAllMuscleGroups(): List<MuscleGroupDTO> = transaction {
        MuscleGroup.selectAll().map {
            it.toMuscleGroupDTO()
        }
    }

    fun findMuscleGroupById(id: Long): MuscleGroupDTO? = transaction {
        MuscleGroup.selectAll()
            .where { MuscleGroup.id eq id }
            .map { it.toMuscleGroupDTO() }
            .singleOrNull()
    }
}
