package org.example.models
import org.jetbrains.exposed.sql.Table 
object Exercises : Table("exercises") {
    val id = long("id").autoIncrement()
    val name = varchar("name", 255).nullable()
    val image = text("image").nullable()
    override val primaryKey = PrimaryKey(id)
}