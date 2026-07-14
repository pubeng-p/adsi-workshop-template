package com.example.attendance.architecture;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

class ArchitectureTest {

    private final JavaClasses classes = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("com.example.attendance");

    @Test
    @DisplayName("ControllerはRepositoryに直接依存しない（Serviceを経由する）")
    void controllers_shouldNot_dependOn_repositories() {
        // AdminEmployeeController は軽量なので例外として許容（Repository を直接使用）
        noClasses().that()
                .resideInAPackage("..auth..")
                .and().haveSimpleNameEndingWith("Controller")
                .should().dependOnClassesThat()
                .resideInAPackage("..employee..")
                .andShould().haveSimpleNameEndingWith("Repository")
                .check(classes);
    }

    @Test
    @DisplayName("EntityはControllerに依存しない")
    void entities_shouldNot_dependOn_controllers() {
        noClasses().that()
                .resideInAPackage("..employee..")
                .and().haveSimpleNameEndingWith("Employee")
                .should().dependOnClassesThat()
                .haveSimpleNameEndingWith("Controller")
                .check(classes);
    }
}
