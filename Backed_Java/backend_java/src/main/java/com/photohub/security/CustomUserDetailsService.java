package com.photohub.security;

import com.photohub.model.Admin;
import com.photohub.model.Client;
import com.photohub.model.Photographer;
import com.photohub.repository.AdminRepository;
import com.photohub.repository.ClientRepository;
import com.photohub.repository.PhotographerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PhotographerRepository photographerRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        
        Optional<Client> client = clientRepository.findByEmail(email);
        if (client.isPresent()) {
            return CustomUserDetails.create(client.get());
        }

        Optional<Photographer> photographer = photographerRepository.findByEmail(email);
        if (photographer.isPresent()) {
            return CustomUserDetails.create(photographer.get());
        }

        Optional<Admin> admin = adminRepository.findByEmail(email);
        if (admin.isPresent()) {
            return CustomUserDetails.create(admin.get());
        }

        throw new UsernameNotFoundException("User not found with email : " + email);
    }
}
