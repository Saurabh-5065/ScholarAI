package com.scholarai;

import com.scholarai.config.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class ScholarAiApplication {
    public static void main(String[] args) {
        SpringApplication.run(ScholarAiApplication.class, args);
    }
}
