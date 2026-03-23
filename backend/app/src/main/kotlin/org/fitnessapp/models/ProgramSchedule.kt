package org.fitnessapp.models

import org.jetbrains.exposed.sql.*
import kotlinx.serialization.Serializable

object ProgramSchedule : Table("program_schedule") {
    val id = long("id").autoIncrement()
    val day = varchar("day", 255)
    val programId = reference("program_id", Program.id)
    override val primaryKey = PrimaryKey(id)
}

@Serializable
data class ProgramScheduleDTO(
    val id: Long? = null,
    val day: String,
    val programId: Long
)
