package org.fitnessapp.data

import org.fitnessapp.models.MetricType
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll

object MetricTypeSeeder {

    fun seed() {
        val inputStream = object {}.javaClass
            .getResourceAsStream("/data/metric_types.csv")
            ?: error("Cannot find metric_types.csv")

        inputStream.bufferedReader().useLines { lines ->
            lines.drop(1).forEach { line ->
                val name = line.trim()

                if (name.isNotBlank()) {
                    val exists = MetricType
                        .selectAll()
                        .where { MetricType.name eq name }
                        .singleOrNull()

                    if (exists == null) {
                        MetricType.insert {
                            it[MetricType.name] = name
                        }
                    }
                }
            }
        }
    }
}