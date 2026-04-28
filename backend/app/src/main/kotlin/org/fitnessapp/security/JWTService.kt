package org.fitnessapp.security

import com.auth0.jwt.JWT
import com.auth0.jwt.algorithms.Algorithm

object JWTService {

    private const val secret = "apples"

    fun generateToken(userId: Long): String {
        return JWT.create()
            .withClaim("userId", userId)
            .sign(Algorithm.HMAC256(secret))
    }
}