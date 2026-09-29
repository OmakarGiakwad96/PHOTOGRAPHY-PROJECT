package com.photohub.security;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Getter
@AllArgsConstructor
public class CustomUserDetails implements UserDetails {

    private Long id;
    private String email;
    private String name;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;

    public static CustomUserDetails create(com.photohub.model.Client client) {
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + client.getRole().name());
        return new CustomUserDetails(client.getClientId(), client.getEmail(), client.getName(), client.getPassword(), Collections.singletonList(authority));
    }

    public static CustomUserDetails create(com.photohub.model.Photographer photographer) {
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + photographer.getRole().name());
        return new CustomUserDetails(photographer.getPhotographerId(), photographer.getEmail(), photographer.getName(), photographer.getPassword(), Collections.singletonList(authority));
    }

    public static CustomUserDetails create(com.photohub.model.Admin admin) {
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + admin.getRole().name());
        return new CustomUserDetails(admin.getAdminId(), admin.getEmail(), admin.getName(), admin.getPassword(), Collections.singletonList(authority));
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
