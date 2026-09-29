package com.photohub.controller;

import com.photohub.dto.ApiResponse;
import com.photohub.dto.JwtAuthenticationResponse;
import com.photohub.dto.LoginRequest;
import com.photohub.dto.RegisterRequest;
import com.photohub.security.CustomUserDetails;
import com.photohub.security.JwtTokenProvider;
import com.photohub.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return ResponseEntity.ok(new JwtAuthenticationResponse(
                jwt,
                userDetails.getId(),
                userDetails.getAuthorities().iterator().next().getAuthority(),
                userDetails.getName() // Return the actual name added to CustomUserDetails
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            Object user = authService.registerUser(registerRequest);
            return ResponseEntity.ok(new ApiResponse(true, "User registered successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        // Implement email sending logic here
        return ResponseEntity.ok(new ApiResponse(true, "Password reset link sent to email (Mock)"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestParam String email, @RequestParam String newPassword) {
        authService.changePassword(email, newPassword);
        return ResponseEntity.ok(new ApiResponse(true, "Password updated successfully"));
    }
}
