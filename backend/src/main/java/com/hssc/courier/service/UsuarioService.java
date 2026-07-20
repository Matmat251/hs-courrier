package com.hssc.courier.service;

import com.hssc.courier.model.Usuario;
import com.hssc.courier.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public List<Usuario> listarActivos() {
        return usuarioRepository.findByEstado(true);
    }

    public List<Usuario> listarRepartidores() {
        return usuarioRepository.findByRol_Nombre("REPARTIDOR");
    }

    public Usuario buscarPorId(Integer id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
    }

    public Usuario guardar(Usuario usuario) {
        if (usuarioRepository.existsByCorreo(usuario.getCorreo())) {
            throw new RuntimeException("Ya existe un usuario con el correo: " + usuario.getCorreo());
        }
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        return usuarioRepository.save(usuario);
    }

    public Usuario actualizar(Integer id, Usuario datos) {
        Usuario existente = buscarPorId(id);
        existente.setNombre(datos.getNombre());
        existente.setApellido(datos.getApellido());
        existente.setRol(datos.getRol());
        existente.setEstado(datos.getEstado());
        return usuarioRepository.save(existente);
    }

    public void cambiarEstado(Integer id, Boolean estado) {
        Usuario usuario = buscarPorId(id);
        usuario.setEstado(estado);
        usuarioRepository.save(usuario);
    }
}
