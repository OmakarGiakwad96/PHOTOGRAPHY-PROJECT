package com.photohub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.photohub.model")
@EnableJpaRepositories(basePackages = "com.photohub.repository")
public class PhotoHubApplication {
	public static void main(String[] args) {
		SpringApplication.run(PhotoHubApplication.class, args);
	}
}
