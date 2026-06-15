export default function AuthorCard() {
  return (
    <section className="author-section">
      <div className="author-card">
        <div className="author-avatar">
          <div className="avatar-placeholder">AV</div>
        </div>
        <div className="author-info">
          <h2 className="author-name">A7Vicky</h2>
          <p className="author-bio">Senior Site Reliability Engineer</p>
          <p className="author-description">
            Passionate about creating clean, efficient code and sharing knowledge with the developer community.
            I write about technology, programming, and my journey in software engineering.
            Technical Associate with a solid foundation in the software industry and
            hands-on expertise in building and operating highly available, scalable cloud-native infrastructure.
            Experienced in cloud platforms (AWS/GCP/Azure), containerization (Docker, Kubernetes), and CI/CD pipelines
            (Jenkins, GitOps). Skilled in implementing robust observability stacks (logging, metrics, tracing) and
            developing automation using Python, Golang, and Bash. Passionate about driving operational excellence,
            reducing toil, and improving system reliability through proactive monitoring and incident response.
            Holds a B.Tech in Electronics and Communications Engineering from DIT University.
          </p>
          <div className="social-links">
            <a href="https://github.com/a7vicky" className="social-link" target="_blank" rel="noopener noreferrer">
              <span className="social-icon">📱</span> GitHub
            </a>
            <a href="https://twitter.com/vicky18dec" className="social-link" target="_blank" rel="noopener noreferrer">
              <span className="social-icon">🐦</span> Twitter
            </a>
            <a href="https://linkedin.com/in/a7vicky" className="social-link" target="_blank" rel="noopener noreferrer">
              <span className="social-icon">💼</span> LinkedIn
            </a>
            <a href="mailto:a7vicky1812@gmail.com" className="social-link">
              <span className="social-icon">📧</span> Email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
