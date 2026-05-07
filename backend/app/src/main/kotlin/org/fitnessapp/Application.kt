package org.fitnessapp

import kotlinx.serialization.json.Json
import java.io.File

import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.cors.routing.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.plugins.swagger.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.server.auth.*
import io.ktor.server.auth.jwt.*

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm

import org.fitnessapp.routes.userRoutes
import org.fitnessapp.routes.profileRoutes
import org.fitnessapp.routes.programRoutes
import org.fitnessapp.routes.programExerciseRoutes
import org.fitnessapp.routes.programExerciseMetricRoutes
import org.fitnessapp.routes.programScheduleRoutes
import org.fitnessapp.routes.activityRoutes
import org.fitnessapp.routes.activityMetricRoutes
import org.fitnessapp.routes.metricTypeRoutes
import org.fitnessapp.routes.exerciseRoutes
import org.fitnessapp.routes.muscleGroupRoutes
import org.fitnessapp.routes.categoryRoutes
import org.fitnessapp.routes.raceRoutes
import org.fitnessapp.routes.conversationRoutes
import org.fitnessapp.routes.messageRoutes
import org.fitnessapp.routes.chatRoutes

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun loadEnvValue(key: String): String? {
    val possibleEnvFiles = listOf(
        File(".env"),
        File("../.env"),
        File("../../.env"),
        File("backend/.env")
    )

    val envFile = possibleEnvFiles.firstOrNull { it.exists() }

    if (envFile == null) {
        return System.getenv(key)
    }

    return envFile
        .readLines()
        .map { it.trim() }
        .filter { it.isNotEmpty() && !it.startsWith("#") }
        .mapNotNull { line ->
            val parts = line.split("=", limit = 2)

            if (parts.size == 2) {
                parts[0].trim() to parts[1].trim()
            } else {
                null
            }
        }
        .firstOrNull { it.first == key }
        ?.second
        ?.trim()
        ?.removeSuffix("/")
        ?: System.getenv(key)
}

fun Application.module() {
    initDatabase()

    val frontendOrigin = (loadEnvValue("FRONTEND_ORIGIN") ?: "http://localhost:5173")
        .trim()
        .removeSuffix("/")

    install(CORS) {
        allowHost("localhost:5173", schemes = listOf("http"))
        allowHost("localhost:3000", schemes = listOf("http"))
        allowHost("127.0.0.1:5173", schemes = listOf("http"))
        allowHost("127.0.0.1:3000", schemes = listOf("http"))

        if (frontendOrigin.startsWith("http://")) {
            allowHost(
                frontendOrigin.removePrefix("http://").removeSuffix("/"),
                schemes = listOf("http")
            )
        }

        if (frontendOrigin.startsWith("https://")) {
            allowHost(
                frontendOrigin.removePrefix("https://").removeSuffix("/"),
                schemes = listOf("https")
            )
        }

        allowHeader(HttpHeaders.ContentType)
        allowHeader(HttpHeaders.Authorization)

        allowMethod(HttpMethod.Get)
        allowMethod(HttpMethod.Post)
        allowMethod(HttpMethod.Put)
        allowMethod(HttpMethod.Delete)
        allowMethod(HttpMethod.Patch)
        allowMethod(HttpMethod.Options)
    }

    install(ContentNegotiation) {
        json(
            Json {
                prettyPrint = true
                isLenient = true
                ignoreUnknownKeys = true
            }
        )
    }

    install(StatusPages) {
        exception<Throwable> { call, cause ->
            call.respond(
                HttpStatusCode.InternalServerError,
                mapOf("error" to (cause.message ?: "Unknown error"))
            )
        }
    }

    install(Authentication) {
        jwt("auth-jwt") {
            realm = "fitnessapp"

            verifier(
                JWT
                    .require(Algorithm.HMAC256("secret"))
                    .build()
            )

            validate { credential ->
                if (credential.payload.getClaim("userId").asLong() != null) {
                    JWTPrincipal(credential.payload)
                } else {
                    null
                }
            }
        }
    }

    install(WebSockets)

    routing {
        swaggerUI(path = "swagger", swaggerFile = "openapi.yaml")

        userRoutes()
        profileRoutes()

        programRoutes()
        programExerciseRoutes()
        programExerciseMetricRoutes()
        programScheduleRoutes()

        activityRoutes()
        activityMetricRoutes()
        metricTypeRoutes()

        exerciseRoutes()
        muscleGroupRoutes()
        categoryRoutes()

        raceRoutes()

        conversationRoutes()
        messageRoutes()
        chatRoutes()
    }

    val port = environment.config.property("ktor.deployment.port").getString()

    println("🚀 Server running at \u001B[32mhttp://localhost:$port\u001B[0m")
    println("🌐 Allowed frontend origin: \u001B[36m$frontendOrigin\u001B[0m")
}