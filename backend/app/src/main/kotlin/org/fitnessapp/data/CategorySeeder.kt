package org.fitnessapp.data

import org.fitnessapp.models.Category
import org.jetbrains.exposed.sql.insert
import org.jetbrains.exposed.sql.selectAll

object CategorySeeder {

    fun seed() {
        val inputStream = object {}.javaClass
            .getResourceAsStream("/data/categories.csv")
            ?: error("Cannot find categories.csv")

        inputStream.bufferedReader().useLines { lines ->
            lines.drop(1).forEach { line ->
                val parts = line.split(",", limit = 2)

                if (parts.size == 2) {
                    val name = parts[0].trim()
                    val image = parts[1].trim()

                    val exists = Category
                        .selectAll()
                        .where { Category.name eq name }
                        .singleOrNull()

                    if (exists == null) {
                        Category.insert {
                            it[Category.name] = name
                            it[Category.image] = image
                        }
                    }
                }
            }
        }
    }
}