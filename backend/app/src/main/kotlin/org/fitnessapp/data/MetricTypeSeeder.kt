package org.fitnessapp.data

import org.fitnessapp.models.MetricType
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll
import org.jetbrains.exposed.sql.and

object MetricTypeSeeder {

    fun seed() {
        val inputStream = object {}.javaClass
            .getResourceAsStream("/data/metric_types.csv")
            ?: error("Cannot find metric_types.csv")

        inputStream.bufferedReader().useLines { lines ->
            lines.drop(1).forEach { line ->
                val parts = line.split(",")

                val name = parts.getOrNull(0)
                    ?.trim()
                    ?.takeIf { it.isNotBlank() }
                    ?: return@forEach   // skip invalid rows

                val unit = parts.getOrNull(1)
                    ?.trim()
                    ?.ifEmpty { null }

                val exists = MetricType
                    .selectAll()
                    .where {
                        (MetricType.name eq name) and
                        (MetricType.unit eq unit)
                    }
                    .singleOrNull()

                if (exists == null) {
                    MetricType.insert {
                        it[MetricType.name] = name
                        it[MetricType.unit] = unit
                    }
                }
            }
        }
    }
}