package com.example.attendance.employee;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
class EmployeeRepositoryTest {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Test
    @DisplayName("存在するloginIdで検索すると社員が返される")
    void findByLoginId_existingId_returnsEmployee() {
        // Arrange - Flyway V5 で admin が挿入済み

        // Act
        Optional<Employee> result = employeeRepository.findByLoginId("admin");

        // Assert
        assertThat(result).isPresent();
        assertThat(result.get().getName()).isEqualTo("管理者");
        assertThat(result.get().getRole()).isEqualTo(Role.ADMIN);
    }

    @Test
    @DisplayName("存在しないloginIdで検索するとemptyが返される")
    void findByLoginId_notFound_returnsEmpty() {
        // Act
        Optional<Employee> result = employeeRepository.findByLoginId("nonexistent");

        // Assert
        assertThat(result).isEmpty();
    }
}
