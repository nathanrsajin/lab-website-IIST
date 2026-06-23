import os
import re

directory = '/Users/nathan/Downloads/files'

def update_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Add Members Portal to the main nav
    # We look for the Resources link and insert after it, or People link and insert before it.
    
    # Header Nav
    header_pattern = r'( +)(<a href="people\.html"(?: class="active")?>People</a>)'
    header_replacement = r'\1<a href="members.html">Members Portal</a>\n\1<a href="admin.html" class="admin-link" style="display: none;">Admin Dashboard</a>\n\1\2'
    content = re.sub(header_pattern, header_replacement, content)

    # Note: Because the header and footer both match the pattern (just different indentation), the above regex with \1 captures the indentation and inserts it correctly for both header and footer.
    
    with open(filepath, 'w') as f:
        f.write(content)

for filename in os.listdir(directory):
    if filename.endswith('.html'):
        update_file(os.path.join(directory, filename))
