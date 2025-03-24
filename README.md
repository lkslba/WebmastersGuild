# WebmastersGuild

A community platform celebrating personal website creation and ownership. This project aims to foster a supportive environment for webmasters, encourage new personal website development, and facilitate discovery and networking among members.

## Technology Stack

- **Hugo Static Site Generator** - Primary engine for site generation
- **Netlify** - Hosting, form handling, identity service
- **Vanilla CSS** - No frameworks, just pure CSS
- **Minimal JavaScript** - Progressive enhancement approach

## Development

### Prerequisites

- [Hugo](https://gohugo.io/getting-started/installing/) (v0.111.3 or newer)
- [Git](https://git-scm.com/downloads)

### Local Development

1. Clone this repository:
```bash
git clone https://github.com/yourusername/WebmastersGuild.git
cd WebmastersGuild
```

2. Install dependencies:
```bash
npm install
```

3. Start the Netlify development server:
```bash
npm run dev
```

4. Visit `http://localhost:3000` in your browser to see the site.

Note: Using the Netlify development server allows you to test serverless functions locally.

### Project Structure

- **content/** - Markdown files for site content
- **layouts/** - HTML templates
- **static/** - CSS, JavaScript, images, and other static assets
- **themes/webmasters-guild/** - Custom theme for the site
- **data/** - YAML/JSON/TOML data files
- **functions/** - Netlify serverless functions that handle dynamic features

### Netlify Functions

The WebmastersGuild uses Netlify Functions to provide dynamic functionality in an otherwise static site. These functions include:

- **register-member.js** - Handles new member registration
- **get-member.js** - Retrieves authenticated member data
- **get-members.js** - Lists all members with filtering capabilities
- **update-member.js** - Updates member profiles and settings
- **webring.js** - Manages WebRing navigation between member sites

The serverless functions integrate with Netlify Identity for authentication and store member data in a JSON file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the classic web and medieval guild systems
- UI design influenced by [Advent of Code](https://adventofcode.com/)
- Built with [Hugo](https://gohugo.io/)
- Deployed on [Netlify](https://www.netlify.com/)
- Authentication through [Netlify Identity](https://docs.netlify.com/visitor-access/identity/)

## Features

- **Member Registration & Profiles**: Self-service registration and profile management
- **Website Directory**: Browsable directory of member websites with filtering
- **WebRing**: Classic WebRing navigation to discover member sites
- **Achievement System**: Awards for participation and website features
- **Terminal/Console Aesthetic**: Clean, monospace design inspired by code terminals