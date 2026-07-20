package com.hssc.courier.service;

import com.hssc.courier.model.Cliente;
import com.hssc.courier.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    public List<Cliente> listarTodos() {
        return clienteRepository.findAll();
    }

    public Cliente buscarPorId(Integer id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + id));
    }

    public List<Cliente> buscarPorNombre(String texto) {
        return clienteRepository.findByRazonSocialContainingIgnoreCase(texto);
    }

    public Cliente guardar(Cliente cliente) {
        if (clienteRepository.existsByTipoDocumentoAndNumeroDocumento(
                cliente.getTipoDocumento(), cliente.getNumeroDocumento())) {
            throw new RuntimeException("Ya existe un cliente con el documento: "
                    + cliente.getTipoDocumento() + " " + cliente.getNumeroDocumento());
        }
        return clienteRepository.save(cliente);
    }

    public Cliente actualizar(Integer id, Cliente datos) {
        Cliente existente = buscarPorId(id);
        existente.setTipoDocumento(datos.getTipoDocumento());
        existente.setNumeroDocumento(datos.getNumeroDocumento());
        existente.setRazonSocial(datos.getRazonSocial());
        existente.setDireccion(datos.getDireccion());
        existente.setTelefono(datos.getTelefono());
        existente.setCorreo(datos.getCorreo());
        return clienteRepository.save(existente);
    }

    public void eliminar(Integer id) {
        buscarPorId(id);
        clienteRepository.deleteById(id);
    }
}
