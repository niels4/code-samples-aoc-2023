import Foundation

enum FileReadError: Error {
    case unableToRead
}

func readFile(_ relativePath: String) throws -> String {
    let fileManager = FileManager.default
    let currentDirectoryPath = fileManager.currentDirectoryPath
    let fileURL = URL(fileURLWithPath: currentDirectoryPath).appendingPathComponent(relativePath)

    do {
        return try String(contentsOf: fileURL, encoding: .utf8)
    } catch {
        throw FileReadError.unableToRead
    }
}
