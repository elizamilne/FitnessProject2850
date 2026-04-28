package org.fitnessapp.security

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm
import com.auth0.jwt.exceptions.JWTVerificationException

object JWTService {

    private const val secret = "apples"
    private val algorithm = Algorithm.HMAC256(secret)

    fun generateToken(userId: Long): String {
        return JWT.create()
            .withClaim("userId", userId)
            .sign(algorithm)
    }

    fun verifyToken(token: String): Long? {
        return try {
            val decoded = JWT.require(algorithm)
                .build()
                .verify(token)

            decoded.getClaim("userId").asLong()
        } catch (e: JWTVerificationException) {
            null
        }
    }
}