package com.iclinica.closefriend.ui;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.CacheControl;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Objects;
import java.util.concurrent.TimeUnit;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Objects.requireNonNull(registry);

        // could use either '/**/images/{filename:\w+\.png}' or '/**/images/*.png'
        registry.addResourceHandler("/**").setCachePeriod(0);
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:public/")
                .setCacheControl(CacheControl.maxAge(2, TimeUnit.DAYS));
    }
}