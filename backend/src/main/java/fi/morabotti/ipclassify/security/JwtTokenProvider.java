package fi.morabotti.ipclassify.security;

import fi.morabotti.ipclassify.config.options.SecurityOptions;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

@Component
public class JwtTokenProvider {
    private final SecurityOptions options;
    private final Key signingKey;

    public JwtTokenProvider(SecurityOptions options) {
        this.options = options;
        this.signingKey = this.getSigningKey();
    }

    public String generateToken(ApplicationUser user) {
        return Jwts.builder()
                .setSubject(user.getUsername())
                .setId(user.getId().toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + options.getAccessExpiration()))
                .addClaims(Map.of(
                        "id", user.getId(),
                        "username", user.getUsername()
                ))
                .setIssuer(SecurityOptions.JWT_ISSUER)
                .setAudience(SecurityOptions.JWT_AUDIENCE)
                .signWith(signingKey, SignatureAlgorithm.HS512)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            buildParser().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Authentication getAuthentication(String token) {
        Claims claims = buildParser().parseClaimsJws(token).getBody();
        return new UsernamePasswordAuthenticationToken(
                ApplicationUser.from(claims),
                null,
                null
        );
    }

    private JwtParser buildParser() {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build();
    }

    private Key getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(options.getJwtSecret());
        return new SecretKeySpec(keyBytes, SignatureAlgorithm.HS512.getJcaName());
    }
}
