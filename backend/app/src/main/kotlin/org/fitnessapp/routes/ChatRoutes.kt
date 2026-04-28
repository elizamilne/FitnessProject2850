package org.fitnessapp.routes

import io.ktor.server.routing.*
import io.ktor.server.websocket.*
import io.ktor.websocket.*
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

import org.fitnessapp.services.MessageService

val rooms = mutableMapOf<Long, MutableList<DefaultWebSocketServerSession>>()

@Serializable
data class ChatMessage(
    val content: String,
    val profileId: Long,
    val conversationId: Long
)

fun Route.chatRoutes() {

    webSocket("/chat") {

        val conversationId =
            call.request.queryParameters["conversationId"]?.toLongOrNull()

        val userId =
            call.request.queryParameters["userId"]?.toLongOrNull()

        if (conversationId == null || userId == null) {
            close(
                CloseReason(
                    CloseReason.Codes.CANNOT_ACCEPT,
                    "Missing params"
                )
            )
            return@webSocket
        }

        val sessionList =
            rooms.getOrPut(conversationId) { mutableListOf() }

        sessionList.add(this)

        try {
            for (frame in incoming) {

                if (frame is Frame.Text) {

                    val text = frame.readText()

                    // save message
                    MessageService.saveMessage(
                        userId,
                        conversationId,
                        text
                    )

                    val message = ChatMessage(
                        content = text,
                        profileId = userId,
                        conversationId = conversationId
                    )

                    val json = Json.encodeToString(message)

                    // broadcast
                    sessionList.forEach {
                        it.send(Frame.Text(json))
                    }
                }
            }
        } finally {
            sessionList.remove(this)

            if (sessionList.isEmpty()) {
                rooms.remove(conversationId)
            }
        }
    }
}