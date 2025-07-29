import type { Client } from "./types"

export const exportToCSV = (clients: Client[]) => {
  const headers = ["Name", "Email", "Phone", "Created At"]
  const csvContent = [
    headers.join(","),
    ...clients.map((client) =>
      [`"${client.name}"`, `"${client.email}"`, `"${client.phone}"`, `"${client.createdAt.toLocaleDateString()}"`].join(
        ",",
      ),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `clients-${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
