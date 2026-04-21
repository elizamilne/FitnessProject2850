package org.fitnessapp.data

import org.fitnessapp.models.MuscleGroup
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll

object MuscleGroupSeeder {

    fun seed() {
        val inputStream = object {}.javaClass
            .getResourceAsStream("/data/muscle_groups.csv")
            ?: error("Cannot find muscle_groups.csv")

        inputStream.bufferedReader().useLines { lines ->
            lines.drop(1).forEach { line ->
                val name = line.trim()

                if (name.isNotBlank()) {
                    val exists = MuscleGroup
                        .selectAll()
                        .where { MuscleGroup.name eq name }
                        .singleOrNull()

                    if (exists == null) {
                        MuscleGroup.insert {
                            it[MuscleGroup.name] = name
                        }
                    }
                }
            }
        }
    }
}