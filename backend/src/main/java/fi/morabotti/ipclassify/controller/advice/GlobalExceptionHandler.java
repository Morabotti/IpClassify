package fi.morabotti.ipclassify.controller.advice;

import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    // @ExceptionHandler(AuthenticationException.class)
    // public Mono<ResponseEntity<String>> handleAuthenticationException(AuthenticationException ex) {
    //     return Mono.error(new ResponseStatusException(HttpStatus.UNAUTHORIZED, ex.getMessage(), ex));
    // }
}
