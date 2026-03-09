package com.fitness

import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.routing.*
import io.ktor.server.response.*
import io.ktor.server.thymeleaf.*
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver
import io.ktor.server.plugins.callloging.*
import org.slf4j.event.Level

fun Application.module() {

    install(CallLogging) { level = Level.INFO }

    install(Thymeleaf) {
        setTemplateResolver(ClassLoaderTemplateResolver().apply {
            prefix = "templates/"
            suffix = ".html"
            characterEncoding = "utf-8"
        })
    }

    routing {
        staticResources("/static", "static")

        get("/") { call.respond(ThymeleafContent("index", mapOf("pageTitle" to "Home"))) }
        get("/login") { call.respond(ThymeleafContent("login", mapOf("pageTitle" to "Login"))) }
        get("/dashboard") { call.respond(ThymeleafContent("dashboard", mapOf("pageTitle" to "Dashboard"))) }
    }
}
