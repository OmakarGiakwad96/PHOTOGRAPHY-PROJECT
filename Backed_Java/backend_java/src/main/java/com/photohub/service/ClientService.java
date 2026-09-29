package com.photohub.service;

import com.photohub.dto.ClientDTO;
import com.photohub.model.Client;
import com.photohub.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class ClientService {

    @Autowired
    private ClientRepository clientRepository;

    public List<ClientDTO> getAllClients() {
        return clientRepository.findAll().stream().map(this::mapToDTO).collect(java.util.stream.Collectors.toList());
    }

    public ClientDTO getClientProfile(Long clientId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        return mapToDTO(client);
    }

    public ClientDTO updateClientProfile(Long clientId, ClientDTO clientDTO) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        if (clientDTO.getName() != null) client.setName(clientDTO.getName());
        if (clientDTO.getPhone() != null) client.setPhone(clientDTO.getPhone());
        if (clientDTO.getProfilePicture() != null) client.setProfilePicture(clientDTO.getProfilePicture());

        Client updatedClient = clientRepository.save(client);
        return mapToDTO(updatedClient);
    }

    private ClientDTO mapToDTO(Client client) {
        return ClientDTO.builder()
                .clientId(client.getClientId())
                .name(client.getName())
                .email(client.getEmail())
                .phone(client.getPhone())
                .role(client.getRole().name())
                .profilePicture(client.getProfilePicture())
                .status(client.getStatus())
                .build();
    }
}
