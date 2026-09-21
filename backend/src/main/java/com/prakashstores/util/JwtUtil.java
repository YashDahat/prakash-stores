package com.prakashstores.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);

    // The demo default shipped in application.properties. Fine for local use; must be overridden in prod.
    private static final String DEMO_DEFAULT_SECRET =
            "ZGVtby1vbmx5LXNlY3JldC1rZXktZm9yLWxvY2FsLXRlc3RpbmctY2hhbmdlLWluLXByb2R1Y3Rpb24tZW52aXJvbm1lbnQ=";

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration-ms}")
    private long expirationMs;

    // Signing keys are the trust root for every JWT — a weak or shared secret lets anyone mint valid
    // admin tokens. Warn loudly at startup rather than failing, so the demo still boots.
    @PostConstruct
    void validateSecret() {
        if (secret == null || secret.isBlank()
                || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            log.error("SECURITY: jwt.secret is missing or shorter than 256 bits (32 bytes). "
                    + "Set a strong, unique JWT_SECRET before any real deployment.");
        } else if (DEMO_DEFAULT_SECRET.equals(secret)) {
            log.warn("SECURITY: jwt.secret is the built-in demo value. Override JWT_SECRET with a "
                    + "unique, high-entropy secret in production.");
        }
    }

    public String generateToken(UserDetails userDetails) {
        // Carry the role as a claim so the frontend can gate UI (backend authz still
        // re-loads authorities from the DB). Authority is the bare role name (no ROLE_ prefix).
        Map<String, Object> claims = new HashMap<>();
        userDetails.getAuthorities().stream().findFirst()
                .ifPresent(authority -> claims.put("role", authority.getAuthority()));
        return generateToken(claims, userDetails.getUsername());
    }

    public String generateToken(Map<String, Object> extraClaims, String subject) {
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(extractAllClaims(token));
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        return extractUsername(token).equals(userDetails.getUsername())
                && !extractExpiration(token).before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }
}
