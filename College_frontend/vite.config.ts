/// <reference types="vitest" />

import { defineConfig } from "vitest/config";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
  },

  plugins: [
    react(),
    babel({
      presets: [reactCompilerPreset()],
    }),
  ],

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    exclude: [
      "node_modules/**",
      "dist/**",
      "src/test/studentCourse.test.tsx",
      "src/styles",
      "src/test/subjectStaff.test.tsx",
      "src/test/interceptor.test.ts",
      "src/test/attendance.test.tsx",
      "src/pages/student/StudentHome.tsx",
      "src/pages/staff/Staffhome.tsx",
    ],
    css: true,
    coverage: {
  provider: "v8",
  reporter: ["text", "json", "html", "lcov"],
  exclude: [
      "node_modules/**",
      "dist/**",
      "src/styles",
      "src/store",
      "src/interceptor.ts",
      "src/pages/student/StudentHome.tsx",
      "src/pages/staff/Staffhome.tsx",
      "src/pages/assignment/AssignmentPage.tsx",
      "src/pages/attendence/MarkAttendence.tsx",
      "src/pages/assignment/ViewAssignments.tsx",
      "src/pages/admin/AdminDashboard.tsx"
    ],
},
  },
});