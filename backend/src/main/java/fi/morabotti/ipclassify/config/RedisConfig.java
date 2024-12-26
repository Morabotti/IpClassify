package fi.morabotti.ipclassify.config;

import fi.morabotti.ipclassify.config.options.RedisOptions;
import fi.morabotti.ipclassify.domain.IpClassification;
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

    private <TKey, TValue> ReactiveRedisTemplate<TKey, TValue> buildTemplate(
            ReactiveRedisConnectionFactory factory,
            Class<TValue> valueClass
    ) {
        StringRedisSerializer keySerializer = new StringRedisSerializer();
        Jackson2JsonRedisSerializer<TValue> valueSerializer = new Jackson2JsonRedisSerializer<>(valueClass);

        RedisSerializationContext.RedisSerializationContextBuilder<TKey, TValue> builder = RedisSerializationContext
                .newSerializationContext(keySerializer);

        RedisSerializationContext<TKey, TValue> context = builder
                .value(valueSerializer)
                .build();

        return new ReactiveRedisTemplate<>(factory, context);
    }
}
