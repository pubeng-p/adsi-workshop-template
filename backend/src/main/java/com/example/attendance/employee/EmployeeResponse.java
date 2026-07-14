package com.example.attendance.employee;

public record EmployeeResponse(
        Long id,
        String loginId,
        String name,
        Role role
) {
    public static EmployeeResponse from(Employee employee) {
        return new EmployeeResponse(
                employee.getId(),
                employee.getLoginId(),
                employee.getName(),
                employee.getRole()
        );
    }
}
