package org.fitnessapp

import org.fitnessapp.models.*
import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.transactions.transaction

import org.fitnessapp.data.ExerciseSeeder
import org.fitnessapp.data.CategorySeeder
import org.fitnessapp.data.MuscleGroupSeeder
import org.fitnessapp.data.MetricTypeSeeder
import org.fitnessapp.data.ExerciseCategorySeeder
import org.fitnessapp.data.ExerciseMuscleGroupSeeder
import org.fitnessapp.data.ExerciseMetricTypeSeeder

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
            ExerciseMetricTypes,
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

    transaction {
        CategorySeeder.seed()
        ExerciseSeeder.seed()
        MuscleGroupSeeder.seed()
        MetricTypeSeeder.seed()
    }

    transaction {
        ExerciseCategorySeeder.seed()
        ExerciseMuscleGroupSeeder.seed()
        ExerciseMetricTypeSeeder.seed()
    }
}