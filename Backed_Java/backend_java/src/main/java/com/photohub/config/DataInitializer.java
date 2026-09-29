package com.photohub.config;

import com.photohub.model.Admin;
import com.photohub.model.Role;
import com.photohub.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (adminRepository.count() == 0) {
            Admin admin = Admin.builder()
                    .name("Rocky Admin")
                    .email("rocky@gmail.com")
                    .password(passwordEncoder.encode("rocky123"))
                    .phone("1234567890")
                    .role(Role.ADMIN)
                    .build();
            adminRepository.save(admin);
            System.out.println("Default admin rocky@gmail.com created.");
        }
    }
}
