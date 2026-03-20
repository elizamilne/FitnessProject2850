package org.fitnessapp.models

import org.jetbrains.exposed.sql.*

object ProgramSchedule : Table("program_schedule") {
    val id = long("id").autoIncrement()
    val day = varchar("day", 255)
    val programId = reference("program_id", Program.id)
    override val primaryKey = PrimaryKey(id)
}