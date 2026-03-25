package org.fitnessapp

import org.fitnessapp.models.*
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction

import org.fitnessapp.data.seed.ExerciseSeeder

fun initDatabase() {
    Database.connect(
        "jdbc:sqlite:fitness_app.db?foreign_keys=on",
        driver = "org.sqlite.JDBC"
    )

    transaction {
        SchemaUtils.create(
            Activity,    
            ActivityMetric,
            Category,
            Exercise,
            ExerciseCategory,
            ExerciseMuscleGroup,
            MetricType,
            MuscleGroup,
            Profile,
            Program,
            ProgramExercise,
            ProgramExerciseMetric,
            ProgramSchedule,
            Race,
            RaceCategory,
            User
        )
    }

    ExerciseSeeder.seedExercisesFromCsv()
}

