package org.fitnessapp.routes

import io.ktor.server.routing.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.http.*

import org.fitnessapp.services.MessageService

fun Route.messageRoutes() {

    route("/messages") {

        get("/{conversationId}") {

            val id = call.parameters["conversationId"]?.toLongOrNull()

            if (id == null) {
                call.respond(
                    HttpStatusCode.BadRequest,
                    mapOf("error" to "Invalid conversationId")
                )
                return@get
            }

            val messages = MessageService.getMessages(id)

            if (messages.isEmpty()) {
                call.respond(HttpStatusCode.OK, emptyList<Any>())
                return@get
            }

            call.respond(messages)
        }
    }
}