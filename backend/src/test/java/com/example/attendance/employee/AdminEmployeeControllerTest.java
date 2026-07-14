package com.example.attendance.employee;

import com.example.attendance.auth.JwtProvider;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminEmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtProvider jwtProvider;

    @Test
    @DisplayName("管理者が社員一覧を取得すると200が返される")
    void getEmployees_asAdmin_200() throws Exception {
        String token = jwtProvider.generateToken(1L, "admin", "ADMIN");

        mockMvc.perform(get("/admin/employees")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].loginId").value("admin"));
    }

    @Test
    @DisplayName("一般社員が社員一覧にアクセスすると403が返される")
    void getEmployees_asEmployee_403() throws Exception {
        String token = jwtProvider.generateToken(2L, "tanaka", "EMPLOYEE");

        mockMvc.perform(get("/admin/employees")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("認証なしで社員一覧にアクセスすると401が返される")
    void getEmployees_noAuth_401() throws Exception {
        mockMvc.perform(get("/admin/employees"))
                .andExpect(status().isUnauthorized());
    }
}
