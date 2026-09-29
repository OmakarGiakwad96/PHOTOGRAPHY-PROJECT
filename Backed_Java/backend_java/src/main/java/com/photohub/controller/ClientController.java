package com.photohub.controller;

import com.photohub.dto.ClientDTO;
import com.photohub.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @GetMapping
    public ResponseEntity<List<ClientDTO>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }

    @GetMapping("/{clientId}")
    public ResponseEntity<ClientDTO> getClientProfile(@PathVariable Long clientId) {
        return ResponseEntity.ok(clientService.getClientProfile(clientId));
    }

    @PutMapping("/{clientId}")
    public ResponseEntity<ClientDTO> updateClientProfile(@PathVariable Long clientId, @RequestBody ClientDTO clientDTO) {
        return ResponseEntity.ok(clientService.updateClientProfile(clientId, clientDTO));
    }
}
