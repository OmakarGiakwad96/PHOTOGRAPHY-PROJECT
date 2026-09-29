package com.photohub.service;

import com.photohub.dto.LoginRequest;
import com.photohub.dto.RegisterRequest;
import com.photohub.model.Admin;
import com.photohub.model.Client;
import com.photohub.model.Photographer;
import com.photohub.model.Role;
import com.photohub.repository.AdminRepository;
import com.photohub.repository.ClientRepository;
import com.photohub.repository.PhotographerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PhotographerRepository photographerRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public Object registerUser(RegisterRequest request) {
        if (clientRepository.existsByEmail(request.getEmail()) || 
            photographerRepository.findByEmail(request.getEmail()).isPresent() ||
            adminRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already taken!");
        }

        Role role = Role.valueOf(request.getRole().toUpperCase());

        if (role == Role.PHOTOGRAPHER) {
            Photographer photographer = Photographer.builder()
                    .name(request.getName())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .phone(request.getPhone())
                    .role(Role.PHOTOGRAPHER)
                    .isVerified(false)
                    .isDeleted(false)
                    .status("active")
                    .build();
            return photographerRepository.save(photographer);
        } else if (role == Role.ADMIN) {
            Admin admin = Admin.builder()
                    .name(request.getName())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .phone(request.getPhone())
                    .role(Role.ADMIN)
                    .build();
            return adminRepository.save(admin);
        } else {
            Client client = Client.builder()
                    .name(request.getName())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .phone(request.getPhone())
                    .role(Role.CLIENT)
                    .status("active")
                    .isDeleted(false)
                    .build();
            return clientRepository.save(client);
        }
    }

    @Transactional
    public void changePassword(String email, String newPassword) {
        String encodedPassword = passwordEncoder.encode(newPassword);
        clientRepository.findByEmail(email).ifPresent(c -> {
            c.setPassword(encodedPassword);
            clientRepository.save(c);
        });
        photographerRepository.findByEmail(email).ifPresent(p -> {
            p.setPassword(encodedPassword);
            photographerRepository.save(p);
        });
        adminRepository.findByEmail(email).ifPresent(a -> {
            a.setPassword(encodedPassword);
            adminRepository.save(a);
        });
    }
}
