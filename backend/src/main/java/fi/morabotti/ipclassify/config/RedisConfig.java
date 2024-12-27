package fi.morabotti.ipclassify.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import fi.morabotti.ipclassify.config.options.RedisOptions;
import fi.morabotti.ipclassify.domain.IpClassification;
import fi.morabotti.ipclassify.domain.LocationRecord;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.ReactiveRedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@RequiredArgsConstructor
public class RedisConfig {
    private final RedisOptions options;

    @Bean
    @Primary
    public ReactiveRedisConnectionFactory reactiveRedisConnectionFactory() {
        return new LettuceConnectionFactory(options.getHost(), options.getPort());
    }

    @Bean
    public ReactiveRedisTemplate<String, IpClassification> reactiveIpClassificationTemplate(
            @Qualifier("reactiveRedisConnectionFactory") ReactiveRedisConnectionFactory factory
    ) {
        return buildTemplate(factory, IpClassification.class);
    }

    @Bean
    public ReactiveRedisTemplate<String, LocationRecord> reactiveLocationRecordTemplate(
            @Qualifier("reactiveRedisConnectionFactory") ReactiveRedisConnectionFactory factory
    ) {
        return buildTemplate(factory, LocationRecord.class);
    }

    private <TKey, TValue> ReactiveRedisTemplate<TKey, TValue> buildTemplate(
            ReactiveRedisConnectionFactory factory,
            Class<TValue> valueClass
    ) {
        ObjectMapper objectMapper = new ObjectMapper()
                .registerModule(new JavaTimeModule())
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        StringRedisSerializer keySerializer = new StringRedisSerializer();
        Jackson2JsonRedisSerializer<TValue> valueSerializer = new Jackson2JsonRedisSerializer<>(valueClass);
        valueSerializer.setObjectMapper(objectMapper);

        RedisSerializationContext.RedisSerializationContextBuilder<TKey, TValue> builder = RedisSerializationContext
                .newSerializationContext(keySerializer);

        RedisSerializationContext<TKey, TValue> context = builder
                .value(valueSerializer)
                .build();

        return new ReactiveRedisTemplate<>(factory, context);
    }
}
