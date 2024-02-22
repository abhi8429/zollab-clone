package com.iclinica.closefriend.ui.security;

import com.iclinica.closefriend.identity.adapter.security.ResourceServerConfigurationAdapter;
import com.iclinica.closefriend.identity.adapter.security.SecurityProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;

import static org.springframework.http.HttpMethod.*;

@Configuration
@EnableResourceServer
@EnableConfigurationProperties(SecurityProperties.class)
public class ResourceServerConfiguration extends ResourceServerConfigurationAdapter {


    public ResourceServerConfiguration(SecurityProperties securityProperties) {
        super(securityProperties);
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests().antMatchers("/").permitAll();
    }

}