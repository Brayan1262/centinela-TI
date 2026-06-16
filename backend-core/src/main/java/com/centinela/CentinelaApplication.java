package com.centinela;

import com.centinela.model.RolUsuario;
import com.centinela.model.Usuario;
import com.centinela.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class CentinelaApplication {

    public static void main(String[] args) {
        SpringApplication.run(CentinelaApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (usuarioRepository.findByUsername("admin").isEmpty()) {
                Usuario admin = new Usuario();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRol(RolUsuario.ADMIN);
                usuarioRepository.save(admin);
                System.out.println("Usuario 'admin' creado con contraseña 'admin123'");
            }
        };
    }

}
